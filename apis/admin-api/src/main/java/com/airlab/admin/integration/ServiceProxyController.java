package com.airlab.admin.integration;

import com.airlab.admin.audit.AdminAuditService;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriUtils;

@RestController
@RequestMapping("/api/admin")
public class ServiceProxyController {

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();

    private final AdminAuditService auditService;
    private final String bookingBaseUrl;
    private final String crewBaseUrl;
    private final String partnerBaseUrl;

    public ServiceProxyController(
            AdminAuditService auditService,
            @Value("${services.booking.base-url}") String bookingBaseUrl,
            @Value("${services.crew.base-url}") String crewBaseUrl,
            @Value("${services.partner.base-url}") String partnerBaseUrl) {
        this.auditService = auditService;
        this.bookingBaseUrl = stripTrailingSlash(bookingBaseUrl);
        this.crewBaseUrl = stripTrailingSlash(crewBaseUrl);
        this.partnerBaseUrl = stripTrailingSlash(partnerBaseUrl);
    }

    @GetMapping("/reservations")
    public ResponseEntity<String> reservations() {
        return forward("GET", bookingBaseUrl + "/api/admin/reservations", null);
    }

    @GetMapping("/qna")
    public ResponseEntity<String> inquiries() {
        return forward("GET", bookingBaseUrl + "/api/qna", null);
    }

    @GetMapping("/qna/{id}")
    public ResponseEntity<String> inquiry(@PathVariable String id) {
        return forward("GET", bookingBaseUrl + "/api/qna/" + path(id), null);
    }

    @PatchMapping("/qna/{id}/answer")
    public ResponseEntity<String> answerInquiry(
            @PathVariable String id,
            @RequestBody String body,
            HttpServletRequest request) {
        ResponseEntity<String> response = forward(
                "PATCH",
                bookingBaseUrl + "/api/admin/qna/" + path(id) + "/answer",
                body);
        recordWrite(request, "QNA_ANSWER", "QNA", id, response);
        return response;
    }

    @PatchMapping("/qna/{id}/status")
    public ResponseEntity<String> changeInquiryStatus(
            @PathVariable String id,
            @RequestBody String body,
            HttpServletRequest request) {
        ResponseEntity<String> response = forward(
                "PATCH",
                bookingBaseUrl + "/api/admin/qna/" + path(id) + "/status",
                body);
        recordWrite(request, "QNA_STATUS_CHANGE", "QNA", id, response);
        return response;
    }

    @GetMapping("/crew")
    public ResponseEntity<String> crew() {
        return forward("GET", crewBaseUrl + "/api/admin/crew", null);
    }

    @GetMapping("/crew/flights/{flightId}")
    public ResponseEntity<String> flight(@PathVariable String flightId) {
        return forward("GET", bookingBaseUrl + "/api/flights/" + path(flightId), null);
    }

    @GetMapping("/crew/flights/{flightId}/crew")
    public ResponseEntity<String> flightCrew(@PathVariable String flightId) {
        return forward("GET", crewBaseUrl + "/api/flights/" + path(flightId) + "/crew", null);
    }

    @GetMapping("/crew/operations")
    public ResponseEntity<String> crewOperations() {
        return forward("GET", crewBaseUrl + "/api/admin/crew/operations", null);
    }

    @GetMapping("/partner/requests")
    public ResponseEntity<String> partnerRequests() {
        return forward("GET", partnerBaseUrl + "/partner/requests", null);
    }

    @GetMapping("/partner/requests/{id}")
    public ResponseEntity<String> partnerRequest(@PathVariable String id) {
        return forward("GET", partnerBaseUrl + "/partner/requests/" + path(id), null);
    }

    @PatchMapping("/partner/requests/{id}/status")
    public ResponseEntity<String> changePartnerRequestStatus(
            @PathVariable String id,
            @RequestBody PartnerStatusRequest body,
            HttpServletRequest request) {
        String status = body.status() == null
                ? ""
                : body.status().trim().toUpperCase(Locale.ROOT);
        if (!status.equals("APPROVED") && !status.equals("REJECTED")) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"success\":false,\"data\":null,\"message\":\"status는 APPROVED 또는 REJECTED여야 합니다.\"}");
        }

        String statusQuery = UriUtils.encodeQueryParam(status, StandardCharsets.UTF_8);
        ResponseEntity<String> response = forward(
                "PATCH",
                partnerBaseUrl + "/partner/requests/" + path(id) + "/status?status=" + statusQuery,
                null);
        recordWrite(request, "PARTNER_REQUEST_STATUS", "PARTNER_REQUEST", id, response);
        return response;
    }

    private record PartnerStatusRequest(String status, String reason) {
    }

    private ResponseEntity<String> forward(String method, String url, String body) {
        try {
            HttpRequest.Builder request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(8))
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);

            if (body == null) {
                request.method(method, HttpRequest.BodyPublishers.noBody());
            } else {
                request.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .method(method, HttpRequest.BodyPublishers.ofString(body));
            }

            HttpResponse<String> upstream = httpClient.send(
                    request.build(),
                    HttpResponse.BodyHandlers.ofString());

            return ResponseEntity.status(upstream.statusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(upstream.body());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            return unavailable(url);
        } catch (Exception exception) {
            return unavailable(url);
        }
    }

    private ResponseEntity<String> unavailable(String url) {
        String servicePath = URI.create(url).getPath();
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"success\":false,\"data\":null,\"message\":\"연동 서비스에 연결할 수 없습니다: "
                        + jsonEscape(servicePath) + "\"}");
    }

    private void recordWrite(
            HttpServletRequest request,
            String action,
            String targetType,
            String targetId,
            ResponseEntity<String> response) {
        Object adminId = request.getSession(false).getAttribute("ADMIN_ID");
        auditService.record(
                adminId instanceof Long value ? value : null,
                action,
                targetType,
                targetId,
                response.getStatusCode().is2xxSuccessful() ? "처리 성공" : "처리 실패",
                response.getStatusCode().is2xxSuccessful() ? "SUCCESS" : "FAILURE",
                request);
    }

    private String path(String value) {
        return UriUtils.encodePathSegment(value, StandardCharsets.UTF_8);
    }

    private String stripTrailingSlash(String value) {
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }

    private String jsonEscape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}

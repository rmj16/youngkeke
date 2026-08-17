package com.airlab.admin.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthenticationInterceptor implements HandlerInterceptor {

    public static final String SESSION_ADMIN_ID = "ADMIN_ID";
    public static final String SESSION_LOGIN_ID = "ADMIN_LOGIN_ID";
    public static final String SESSION_DISPLAY_NAME = "ADMIN_DISPLAY_NAME";
    public static final String SESSION_ROLE = "ADMIN_ROLE";

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute(SESSION_ADMIN_ID) != null) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(
                "{\"success\":false,\"data\":null,"
                        + "\"message\":\"관리자 로그인이 필요합니다.\"}");
        return false;
    }
}

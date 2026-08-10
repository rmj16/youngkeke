import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Check, CreditCard, ShieldCheck, Smartphone, X } from "lucide-react";
const methods = [{
id: "easy",
icon: Smartphone,
title: "간편 결제",
detail: "카카오페이 · 네이버페이 · 토스"
}, {
id: "bank",
icon: Banknote,
title: "계좌이체",
detail: "실시간 계좌이체"
}, {
id: "card",
icon: CreditCard,
title: "신용카드",
detail: "국내외 신용·체크카드"
}];
export default function PaymentPopup({
open,
total,
onClose,
onComplete
}) {
const [method, setMethod] = useState("easy");
const [agreed, setAgreed] = useState(false);
return <AnimatePresence>
{open && <motion.div className="modal-backdrop" initial={{
opacity: 0
}} animate={{
opacity: 1
}} exit={{
opacity: 0
}} onMouseDown={onClose}>
<motion.div className="payment-modal" initial={{
  opacity: 0,
  y: 24,
  scale: .97
  }} animate={{
  opacity: 1,
  y: 0,
  scale: 1
  }} exit={{
  opacity: 0,
  y: 24
  }} onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true">
  <div className="modal-header">
    <div>
      <small>SECURE PAYMENT</small>
      <h2>결제 방식을 선택해 주세요</h2>
    </div>
    <button onClick={onClose} aria-label="결제창 닫기">
      <X />
    </button>
  </div>
  <div className="payment-popup-body">
    <div className="payment-options popup-options">
      {methods.map(({
      id,
      icon: Icon,
      title,
      detail
      }) =>
      <button key={id} className={method === id ? "selected" : ""} onClick={() => setMethod(id)}>
        <Icon />
        <div>
          <strong>{title}</strong>
          <small>{detail}</small>
        </div>
        <span className="radio-dot" />
      </button>)}
    </div>
    <div className="payment-total">
      <span>최종 결제 금액<small>항공권, 세금 및 부가서비스 포함</small>
    </span>
    <strong>₩ {total}</strong>
  </div>
  <label className="check-line agree">
    <input type="checkbox" checked={agreed} onChange={event => setAgreed(event.target.checked)} />
    <span>운송 약관, 환불 규정 및 개인정보 처리방침에 모두 동의합니다.</span>
  </label>
  <div className="secure-note">
    <ShieldCheck size={17} />
    <span>결제 정보는 안전하게 암호화되어 처리됩니다.</span>
  </div>
</div>
<div className="payment-popup-footer">
  <button className="popup-cancel" onClick={onClose}>취소</button>
  <button className="popup-pay" disabled={!agreed} onClick={() => onComplete(method)}>
    <Check size={18} /> ₩ {total} 결제하기</button>
  </div>
</motion.div>
</motion.div>}
</AnimatePresence>;
}


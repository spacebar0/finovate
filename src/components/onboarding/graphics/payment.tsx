
'use client';

export function PaymentGraphic() {
  return (
    <svg width="200" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="32" width="160" height="110" rx="12" stroke="white" strokeWidth="4"/>
        <path d="M2 58H162" stroke="white" strokeWidth="4"/>
        
        <rect x="30" y="90" width="40" height="25" rx="4" fill="#FFC300"/>

        <rect x="130" y="95" width="20" height="4" rx="2" fill="white" fillOpacity="0.7"/>
        <rect x="130" y="105" width="20" height="4" rx="2" fill="white" fillOpacity="0.7"/>

        <rect x="38" y="148" width="160" height="110" rx="12" fill="#35258B" stroke="white" strokeWidth="4"/>
        <path d="M38 174H198" stroke="white" strokeWidth="4"/>
        <rect x="68" y="208" width="40" height="25" rx="4" fill="#FFD600"/>
        <rect x="168" y="213" width="20" height="4" rx="2" fill="white" fillOpacity="0.7"/>
        <rect x="168" y="223" width="20" height="4" rx="2" fill="white" fillOpacity="0.7"/>
    </svg>
  );
}

export function PiggyBankGraphic() {
  return (
    <svg
      width="200"
      height="180"
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-1/2 h-auto"
    >
      <path
        d="M170 80C170 113.137 143.137 140 110 140H90C56.8629 140 30 113.137 30 80C30 46.8629 56.8629 20 90 20H110C143.137 20 170 46.8629 170 80Z"
        fill="#FFC300"
      />
      <rect x="100" y="10" width="20" height="40" fill="#FF5733" />
      <path
        d="M140 140V160H160V140H140Z"
        fill="#FF5733"
      />
      <path
        d="M40 140V160H60V140H40Z"
        fill="#FF5733"
      />
      <circle cx="150" cy="60" r="10" fill="white" stroke="black" strokeWidth="2" />
      <circle cx="149" cy="61" r="4" fill="black" />
    </svg>
  );
}

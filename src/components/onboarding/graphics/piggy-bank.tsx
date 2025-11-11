
import Image from 'next/image';

export function PiggyBankGraphic() {
  return (
    <Image
      src="/images/illustration-1.svg"
      alt="Coins illustration"
      width={200}
      height={180}
      className="w-1/2 h-auto"
    />
  );
}

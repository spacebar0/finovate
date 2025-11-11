
import Image from 'next/image';

export function BankGraphic() {
  return (
    <Image
      src="/images/illustration.svg"
      alt="Bank illustration"
      width={270}
      height={235}
      className="w-2/3 h-auto"
      priority
    />
  );
}

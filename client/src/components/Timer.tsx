import { useEffect, useState } from 'react';

type Props = {
  seconds: number;
  onEnd: () => void;
};

export default function Timer({ seconds, onEnd }: Props) {
  const [time, setTime] = useState<number>(seconds);

  useEffect(() => {
    if (time === 0) {
      onEnd();
      return;
    }

    const t = setInterval(() => {
      setTime((s: number) => s - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [time, onEnd]); // eslint satisfied

  return <div>Time Left: {time}s</div>;
}

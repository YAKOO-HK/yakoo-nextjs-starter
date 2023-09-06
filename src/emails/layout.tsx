import { Body, Hr, Html, Tailwind, Text } from '@react-email/components';
import 'server-only';

export function EmailFooter() {
  return (
    <>
      <Hr />
      <Text className="text-xs italic text-neutral-500">
        This is an automated email. Please do not reply to this email.
      </Text>
    </>
  );
}

export default function EmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Body className="font-sans">
          {children}
          <EmailFooter />
        </Body>
      </Tailwind>
    </Html>
  );
}

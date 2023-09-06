import { Link, render, Text } from '@react-email/components';
import { env } from '@/env';
import EmailLayout from '../layout';
import 'server-only';

export const getForgotPasswordEmail = ({
  user,
  passwordResetToken,
}: {
  user: {
    name: string;
  };
  passwordResetToken: string;
}) => {
  return {
    subject: 'Reset your password',
    html: render(<ForgotPasswordEmail user={user} passwordResetToken={passwordResetToken} />),
  };
};

const ForgotPasswordEmail = ({
  user,
  passwordResetToken,
}: {
  user: {
    name: string;
  };
  passwordResetToken: string;
}) => {
  const url = `${env.NEXT_PUBLIC_SITE_URL}/admin/reset-password/?token=${passwordResetToken}`;
  return (
    <EmailLayout>
      <Text>Hi {user.name},</Text>
      <Text>This email was sent to you because you requested a password reset for your account.</Text>
      <Text>Please kindly visit the link below to reset your password:</Text>
      <Link href={url}>{url}</Link>
      <Text>Thank you.</Text>
    </EmailLayout>
  );
};

import { Separator } from '@/components/ui/separator';
import { requireFrontendUser } from '@/lib/auth';
import { ConfirmEnable2FA, DisplayQrCode, GenerateSecret, VerifySetup } from './client';

function StoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="text-blue-500 hover:underline">
      {children}
    </a>
  );
}

export default async function AccountMfaPage() {
  await requireFrontendUser();
  return (
    <div className="container py-4 @container">
      <h1 className="mb-2 text-xl font-bold leading-relaxed">Enable 2FA for your account</h1>
      <h2 className="mb-2 text-lg font-semibold">Prerequisites:</h2>
      <p className="mb-4">Download an Authenticator app on your phone. Below are some recommended apps:</p>
      <ul className="mb-4 flex flex-col space-y-2 pl-4">
        <li className="inline-flex items-center space-x-2">
          <span>Google Authenticator:</span>
          <StoreLink href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">
            Android
          </StoreLink>
          <Separator orientation="vertical" className="h-4 bg-primary" />
          <StoreLink href="https://apps.apple.com/us/app/google-authenticator/id388497605">iOS</StoreLink>
        </li>
        <li className="inline-flex items-center space-x-2">
          <span>Microsoft Authenticator:</span>
          <StoreLink href="https://play.google.com/store/apps/details?id=com.azure.authenticator">Android</StoreLink>
          <Separator orientation="vertical" className="h-4 bg-primary" />
          <StoreLink href="https://apps.apple.com/us/app/microsoft-authenticator/id983156458">iOS</StoreLink>
        </li>
        <li className="inline-flex items-center space-x-2">
          <span>FreeOTP:</span>
          <StoreLink href="https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp">Android</StoreLink>
          <Separator orientation="vertical" className="h-4 bg-primary" />
          <StoreLink href="https://apps.apple.com/us/app/freeotp-authenticator/id872559395">iOS</StoreLink>
        </li>
      </ul>
      <h2 className="mb-2 text-lg font-semibold">Procedure:</h2>
      <ol className="list-inside list-none space-y-2 pl-4">
        <li>
          <p>1. Generate a secret for your account.</p>
          <GenerateSecret />
        </li>
        <li>
          <p>2. Import the secret to your Authenticator app.</p>
          <DisplayQrCode />
        </li>
        <li>
          <p>3. Verify the import.</p>
          <VerifySetup />
        </li>
        <li>
          <p>4. Confirm to enable 2FA.</p>
          <ConfirmEnable2FA />
        </li>
      </ol>
    </div>
  );
}

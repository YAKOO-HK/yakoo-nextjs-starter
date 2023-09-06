import { type Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { RequestPasswordResetForm } from './RequestPasswordResetForm';

export const metadata: Metadata = {
  title: 'Request Password Reset',
  description: null,
};

export default function RequestPasswordResetPage() {
  return (
    <div className="container max-w-screen-md py-4">
      <Card>
        <RequestPasswordResetForm />
      </Card>
    </div>
  );
}

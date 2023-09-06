import { FrontendUsersList } from './FrontendUsersList';

export const metadata = {
  title: 'Frontend Users',
};

export default async function UserPage() {
  return (
    <div className="container max-w-screen-2xl @container">
      <h1 className="my-2 text-xl">Frontend Users</h1>
      <FrontendUsersList />
    </div>
  );
}

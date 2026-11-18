import { usePageTitle } from '../components/layout/ScrollManager';
import { ArrowLink, Container } from '../components/ui';
import { nav } from '../content/site';

export default function NotFound() {
  usePageTitle('Not found');
  return (
    <Container className="pb-10 pt-32 lg:pt-40">
      <p className="mono text-ice">404 — Nothing beneath this surface</p>
      <h1 className="display mt-6 text-[clamp(4rem,14vw,11rem)] text-bone">Not found</h1>
      <p className="prose-body mt-6">That page doesn’t exist or has moved. Try one of these:</p>
      <ul className="mt-6 flex flex-wrap gap-x-8">
        <li>
          <ArrowLink to="/">Home</ArrowLink>
        </li>
        {nav.map((item) => (
          <li key={item.to}>
            <ArrowLink to={item.to}>{item.label}</ArrowLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}

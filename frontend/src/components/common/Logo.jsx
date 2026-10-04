import { Link } from 'react-router-dom';
export default function Logo({ asLink=false }){
  const logo=<img src="/logo.svg" alt="Buddy Aid" className="h-9 w-auto"/>;
  return asLink?<Link to="/">{logo}</Link>:logo;
}

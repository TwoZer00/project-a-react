import { Link, useMatch, useResolvedPath } from "react-router-dom";

export function CustomLink({ children, to, ...props }) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });
  
    return (
      <>
        <Link
          to={to}
          {...props}
        >
          {children}
        </Link>
        {match}
      </>
    );
  }
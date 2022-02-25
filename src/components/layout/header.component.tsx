export const HeaderComponent = (): JSX.Element => {
  const name = "{amazing}";
  return (
    <nav className="navbar navbar-expand bg-dark navbar-dark fixed-top" style={{ height: "64px" }}>
      <div className="d-flex align-items-center">
        <a href="/" className="navbar-brand ms-2 me-1 my-0 p-1">
          {name}
        </a>

        <ul className="navbar-nav ms-1 me-auto my-0 p-1">
          <li className="nav-item">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

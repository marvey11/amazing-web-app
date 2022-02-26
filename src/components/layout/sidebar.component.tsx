import { CSSProperties, useState } from "react";

const sidebarLinks: {
  label: string;
  link: string;
}[] = [
  {
    label: "Wishlists",
    link: "/wishlists",
  },
];

const containerStyle: CSSProperties = {
  position: "absolute",
  top: "64px",
  width: "320px",
  bottom: "0px",
  left: "0px",
};

export const SidebarContainer = (): JSX.Element => {
  return (
    <div className="sidebar-container p-0 pt-3 pb-3 bg-light text-dark" style={containerStyle}>
      <ul className="nav nav-pills d-grid gap-1">
        {sidebarLinks.map((item) => (
          <ListItem key={item.link} label={item.label} link={item.link} />
        ))}
      </ul>
    </div>
  );
};

type ListItemColor = "lightgrey" | "darkgrey";

interface ListItemProps {
  label: string;
  link: string;
}

const ListItem = ({ label, link }: ListItemProps): JSX.Element => {
  const [backgroundColor, setBackgroundColor] = useState<ListItemColor>("lightgrey");

  return (
    <li
      className="nav-item"
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={() => setBackgroundColor("darkgrey")}
      onMouseLeave={() => setBackgroundColor("lightgrey")}
    >
      <a href={link} className="nav-link fw-bold text-decoration-none" style={{ color: "black" }}>
        {label}
      </a>
    </li>
  );
};

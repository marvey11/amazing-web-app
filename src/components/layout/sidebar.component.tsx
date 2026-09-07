import { useState, type CSSProperties, type ReactElement } from "react";

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

export const SidebarContainer = (): ReactElement => {
  return (
    <div
      className="absolute bottom-0 left-0 top-16 w-80 bg-slate-100 p-0 pb-3 pt-3 text-slate-900"
      style={containerStyle}
    >
      <ul className="grid gap-1">
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

const ListItem = ({ label, link }: ListItemProps): ReactElement => {
  const [backgroundColor, setBackgroundColor] =
    useState<ListItemColor>("lightgrey");

  return (
    <li
      className="list-none"
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={() => {
        setBackgroundColor("darkgrey");
      }}
      onMouseLeave={() => {
        setBackgroundColor("lightgrey");
      }}
    >
      <a
        href={link}
        className="block font-bold text-black no-underline"
        style={{ color: "black" }}
      >
        {label}
      </a>
    </li>
  );
};

import { Eyebrow } from "../components";

type FeedItem = {
  id: string;
  source: string;
  text: string;
  time: string;
};

type FeedProps = {
  items: FeedItem[];
};

export function Feed({ items }: FeedProps) {
  return (
    <ol className="app-dash-feed">
      {items.map((item) => (
        <li className="app-dash-feed__item app-fade" key={item.id}>
          <div className="app-dash-feed__meta">
            <Eyebrow tone="muted">{item.time}</Eyebrow>
            <Eyebrow>{item.source}</Eyebrow>
          </div>
          <p className="app-dash-feed__text">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

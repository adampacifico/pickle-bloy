import { EVENTS } from '../constants';

/** Simple, configurable list of club events. */
export default function Events() {
  return (
    <section className="section events" id="events">
      <div className="section__head">
        <p className="section__eyebrow">{EVENTS.eyebrow}</p>
        <h2 className="section__title">{EVENTS.title}</h2>
        <p className="section__sub">{EVENTS.subtitle}</p>
      </div>

      <div className="events__grid">
        {EVENTS.items.map((event) => (
          <article className="event-card" key={event.title}>
            <span className="event-card__tag">{event.tag}</span>
            <h3 className="event-card__title">{event.title}</h3>
            <p className="event-card__when">{event.when}</p>
            <p className="event-card__detail">{event.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
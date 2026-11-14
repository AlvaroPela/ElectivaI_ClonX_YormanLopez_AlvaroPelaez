import { XIcon } from "../ui/components/XIcon";

export const NotificationsPage = () => (
  <main className="x-page-shell">
    <h1>Notificaciones</h1>
    <div className="x-secondary-nav" aria-label="Tipo de notificaciones">
      <a href="#all">Todas</a>
      <a href="#mentions">Menciones</a>
    </div>
    <div className="x-empty-state" id="all">
      <XIcon name="notifications" />
      <h2>Por ahora no hay nada nuevo</h2>
      <p className="text-secondary">
        Aquí aparecerán las notificaciones sobre tu actividad.
      </p>
    </div>
  </main>
);

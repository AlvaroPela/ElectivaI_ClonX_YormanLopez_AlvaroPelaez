import { XIcon } from "../ui/components/XIcon";

export const ChatsPage = () => (
  <main className="x-page-shell">
    <h1>Mensajes</h1>
    <div className="x-empty-state">
      <XIcon name="messages" />
      <h2>Envía un mensaje</h2>
      <p className="text-secondary">
        Inicia una conversación privada con otras personas de Nexo.
      </p>
      <button type="button" className="x-post-button" disabled>
        Nuevo mensaje
      </button>
    </div>
  </main>
);

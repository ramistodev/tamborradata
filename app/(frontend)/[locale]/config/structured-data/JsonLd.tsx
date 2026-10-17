/**
 * Structured data as a plain `<script type="application/ld+json">`, rendered on the server.
 *
 * It is not `next/script`: that one is injected by the client after load, so it is not in the HTML a
 * crawler downloads. `<` is escaped so no text in the data can close the tag.
 */
export function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

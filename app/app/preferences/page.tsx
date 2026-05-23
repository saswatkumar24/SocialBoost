import { permanentRedirect } from "next/navigation";

export default function LegacyPreferencesRedirect() {
  permanentRedirect("/app/settings/preferences");
}

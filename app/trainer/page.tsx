import { archetypes } from "@/data/archetypes";
import Trainer from "@/components/Trainer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function TrainerPage({ searchParams }: any) {
  const params = await searchParams;

  // 1. If custom param exists → use that
  if (params.custom) {
    const decoded = decodeURIComponent(params.custom);
    return <Trainer target={decoded} />;
  }

  // 2. Otherwise pick built-in archetype
  const item = archetypes.find((a) => a.id === params.id);
  if (!item) return <div>Invalid challenge</div>;

  return <Trainer target={item.code} />;
}

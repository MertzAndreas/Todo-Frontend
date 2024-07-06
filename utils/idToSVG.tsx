import { AcornIcon, BandAidIcon, BabyIcon, HorseIcon, FileIcon, BirdIcon, TrashBinIcon, WheelchairIcon, StarIcon, MicroscopeIcon, SpeedometerIcon, MonitorIcon, ProjectorIcon, PackageIcon } from "@/utils/icons";
import {ReactNode} from "react";

type IconComponentProps = React.SVGProps<SVGSVGElement>;

export const getIconById = (id: number, width? : number | string, height? : number | string) : ReactNode  => {
  const IconMap: Record<number, React.FC<IconComponentProps>> = {
    1: AcornIcon,
    2: BandAidIcon,
    3: BabyIcon,
    4: HorseIcon,
    5: FileIcon,
    6: BirdIcon,
    7: TrashBinIcon,
    8: WheelchairIcon,
    9: StarIcon,
    10: MicroscopeIcon,
    11: SpeedometerIcon,
    12: MonitorIcon,
    13: ProjectorIcon,
    14: PackageIcon,
  };

  const IconComponent = IconMap[id];
  if (!IconComponent) {
    throw new Error("Invalid icon id");
  }

  return (
      <IconComponent width={width} height={height} />
  )
};

import {
  AcornIcon,
  BandAidIcon,
  BabyIcon,
  HorseIcon,
  FileIcon,
  BirdIcon,
  TrashBinIcon,
  WheelchairIcon,
  StarIcon,
  MicroscopeIcon,
  SpeedometerIcon,
  MonitorIcon,
  ProjectorIcon,
  PackageIcon,
  CatIcon,
} from "@/utils/icons";
import { ReactNode } from "react";
import { IconProps } from "@chakra-ui/react";

export const iconMap = [
  { id: 0, icon: AcornIcon, label: "Acorn" },
  { id: 1, icon: BandAidIcon, label: "BandAid" },
  { id: 2, icon: BabyIcon, label: "Baby" },
  { id: 3, icon: HorseIcon, label: "Horse" },
  { id: 4, icon: FileIcon, label: "File" },
  { id: 5, icon: BirdIcon, label: "Bird" },
  { id: 6, icon: TrashBinIcon, label: "TrashBin" },
  { id: 7, icon: WheelchairIcon, label: "Wheelchair" },
  { id: 8, icon: StarIcon, label: "Star" },
  { id: 9, icon: MicroscopeIcon, label: "Microscope" },
  { id: 10, icon: SpeedometerIcon, label: "Speedometer" },
  { id: 11, icon: MonitorIcon, label: "Monitor" },
  { id: 12, icon: ProjectorIcon, label: "Projector" },
  { id: 13, icon: PackageIcon, label: "Package" },
  { id: 14, icon: CatIcon, label: "Cat" },
];

export const getIconById = (
    id: number,
    props?: IconProps
): ReactNode => {
  const iconObject = iconMap.find(icon => icon.id === id);
  if (!iconObject) {
    throw new Error("Invalid icon id");
  }
  const IconComponent = iconObject.icon;

  return <IconComponent {...props} />;
};

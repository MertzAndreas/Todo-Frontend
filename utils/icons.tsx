import React from "react";
import { ComponentWithAs, Icon, IconProps } from "@chakra-ui/react";

const BaseIcon: React.FC<IconProps> = ({ children, ...props }) => (
  <Icon viewBox="0 0 256 256" {...props}>
    {children}
  </Icon>
);
export const ChatIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
    >
      <g fill="currentColor">
        <path
          d="M232 152v64a8 8 0 0 1-8 8h-64a72 72 0 0 1-67.9-48H96a72 72 0 0 0 72-72a71.8 71.8 0 0 0-4.07-23.88A72 72 0 0 1 232 152"
          opacity="0.2"
        />
        <path d="M169.57 72.59A80 80 0 0 0 16 104v64a16 16 0 0 0 16 16h54.67A80.15 80.15 0 0 0 160 232h64a16 16 0 0 0 16-16v-64a80 80 0 0 0-70.43-79.41M32 104a64 64 0 1 1 64 64H32Zm192 112h-64a64.14 64.14 0 0 1-55.68-32.43a79.93 79.93 0 0 0 70.38-93.86A64 64 0 0 1 224 152Z" />
      </g>
    </svg>{" "}
  </BaseIcon>
);

export const AcornIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M216 112v16c0 53-88 88-88 112c0-24-88-59-88-112v-16Z"
        opacity={0.2}
      ></path>
      <path d="M232 104a56.06 56.06 0 0 0-56-56h-40a24 24 0 0 1 24-24a8 8 0 0 0 0-16a40 40 0 0 0-40 40H80a56.06 56.06 0 0 0-56 56a16 16 0 0 0 8 13.83V128c0 35.53 33.12 62.12 59.74 83.49C103.66 221.07 120 234.18 120 240a8 8 0 0 0 16 0c0-5.82 16.34-18.93 28.26-28.51C190.88 190.12 224 163.53 224 128v-10.17a16 16 0 0 0 8-13.83M80 64h96a40.06 40.06 0 0 1 40 40H40a40 40 0 0 1 40-40m74.25 135c-10.62 8.52-20 16-26.25 23.37c-6.25-7.32-15.63-14.85-26.25-23.37C77.8 179.79 48 155.86 48 128v-8h160v8c0 27.86-29.8 51.79-53.75 71"></path>
    </g>
  </BaseIcon>
);

export const BandAidIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M206.63 94.63L173.25 128L128 82.75l33.37-33.38a32 32 0 0 1 45.26 45.26M49.37 161.37a32 32 0 0 0 45.26 45.26L128 173.25L82.75 128ZM82.75 128L128 82.75L94.63 49.37a32 32 0 0 0-45.26 45.26Zm90.5 0L128 173.25l33.37 33.38a32 32 0 0 0 45.26-45.26Z"
        opacity={0.2}
      ></path>
      <path d="m184.57 128l27.71-27.72a40 40 0 1 0-56.56-56.56L128 71.43l-27.72-27.71a40 40 0 1 0-56.56 56.56L71.43 128l-27.71 27.72a40 40 0 1 0 56.56 56.56L128 184.57l27.72 27.71a40 40 0 1 0 56.56-56.56ZM167 55a24 24 0 1 1 34 34l-27.72 27.72l-33.97-33.97Zm-5.09 73L128 161.94L94.06 128L128 94.06ZM55 89a24 24 0 1 1 34-34l27.72 27.72l-33.97 33.97Zm34 112a24 24 0 1 1-34-34l27.72-27.72l33.94 33.94Zm112 0a24 24 0 0 1-34 0l-27.72-27.72l33.94-33.94L201 167a24 24 0 0 1 0 34m-85-73a12 12 0 1 1 12 12a12 12 0 0 1-12-12"></path>
    </g>
  </BaseIcon>
);
export const BabyIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96"
        opacity={0.2}
      ></path>
      <path d="M92 140a12 12 0 1 1 12-12a12 12 0 0 1-12 12m72-24a12 12 0 1 0 12 12a12 12 0 0 0-12-12m-12.27 45.23a45 45 0 0 1-47.46 0a8 8 0 0 0-8.54 13.54a61 61 0 0 0 64.54 0a8 8 0 0 0-8.54-13.54M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88.11 88.11 0 0 0-84.09-87.91C120.32 56.38 120 71.88 120 72a8 8 0 0 0 16 0a8 8 0 0 1 16 0a24 24 0 0 1-48 0c0-.73.13-14.3 8.46-30.63A88 88 0 1 0 216 128"></path>
    </g>
  </BaseIcon>
);

export const HorseIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M224 129.37c-.72 51.48-42.57 93.59-94.05 94.61a98.1 98.1 0 0 1-37.81-6.66L128 168c-26.64-16-57.23-11.3-74.7-8.34A24 24 0 0 1 29.79 150L16 128l104-64V32h8a96 96 0 0 1 96 97.37"
        opacity={0.2}
      ></path>
      <path d="M136 100a12 12 0 1 1-12-12a12 12 0 0 1 12 12m96 29.48A104.29 104.29 0 0 1 130.1 232h-2.17a103.32 103.32 0 0 1-69.26-26a8 8 0 1 1 10.67-12a84.7 84.7 0 0 0 20.1 13.37L116 170.84c-22.78-9.83-47.47-5.65-61.4-3.29a31.84 31.84 0 0 1-31.3-12.83l-.3-.43l-13.78-22a8 8 0 0 1 2.59-11.05L112 59.53V32a8 8 0 0 1 8-8h8a104 104 0 0 1 104 105.48m-16-.22A88 88 0 0 0 128 40v24a8 8 0 0 1-3.81 6.81l-97.13 59.78l9.36 15A15.92 15.92 0 0 0 52 151.77c16-2.7 48.77-8.24 78.07 8.18A40.06 40.06 0 0 0 168 120a8 8 0 0 1 16 0a56.07 56.07 0 0 1-51.8 55.83l-27.11 37.28a91 91 0 0 0 24.69 2.89A88.29 88.29 0 0 0 216 129.26"></path>
    </g>
  </BaseIcon>
);
export const FileIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path d="M208 88h-56V32Z" opacity={0.2}></path>
      <path d="m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31L188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48z"></path>
    </g>
  </BaseIcon>
);

export const BirdIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="m232 80l-24 16v24a96 96 0 0 1-96 96H24a8 8 0 0 1-6.25-13L104 99.52V76.89c0-28.77 23-52.75 51.74-52.89a52 52 0 0 1 50.59 38.89Z"
        opacity="0.2"
      />
      <path d="M176 68a12 12 0 1 1-12-12a12 12 0 0 1 12 12m64 12a8 8 0 0 1-3.56 6.66L216 100.28V120a104.11 104.11 0 0 1-104 104H24a16 16 0 0 1-12.49-26l.1-.12L96 96.63V76.89c0-33.42 26.79-60.73 59.71-60.89h.29a60 60 0 0 1 57.21 41.86l23.23 15.48A8 8 0 0 1 240 80m-22.42 0L201.9 69.54a8 8 0 0 1-3.31-4.64A44 44 0 0 0 156 32h-.22C131.64 32.12 112 52.25 112 76.89v22.63a8 8 0 0 1-1.85 5.13L24 208h26.9l70.94-85.12a8 8 0 1 1 12.29 10.24L71.75 208H112a88.1 88.1 0 0 0 88-88V96a8 8 0 0 1 3.56-6.66Z" />
    </g>
  </BaseIcon>
);

export const TrashBinIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path d="M200 56v152a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V56Z" opacity="0.2" />
      <path d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0" />
    </g>
  </BaseIcon>
);

export const WheelchairIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path d="M200 48a24 24 0 1 1-24-24a24 24 0 0 1 24 24" opacity="0.2" />
      <path d="M176 80a32 32 0 1 0-32-32a32 32 0 0 0 32 32m0-48a16 16 0 1 1-16 16a16 16 0 0 1 16-16m-8 136a64 64 0 1 1-64-64a8 8 0 0 1 0 16a48 48 0 1 0 48 48a8 8 0 0 1 16 0m38.19-37.07a8 8 0 0 1 1.65 6.64l-16 80A8 8 0 0 1 184 224a7.8 7.8 0 0 1-1.58-.16a8 8 0 0 1-6.27-9.41L190.24 144H128a8 8 0 0 1-6.94-12l20.06-34.9a80.09 80.09 0 0 0-88 9.17A8 8 0 1 1 42.91 94a96 96 0 0 1 113.46-6.42a8 8 0 0 1 2.57 10.69L141.82 128H200a8 8 0 0 1 6.19 2.93" />
    </g>
  </BaseIcon>
);

export const StarIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="m230.08 78.26l-31.84 26.88l9.76 40.19a5.46 5.46 0 0 1-8.19 5.86L164 129.66l-35.78 21.53a5.46 5.46 0 0 1-8.19-5.86l9.73-40.19l-31.84-26.88a5.38 5.38 0 0 1 3.13-9.48l41.79-3.31l16.1-38.14a5.51 5.51 0 0 1 10.12 0l16.1 38.14L227 68.78a5.38 5.38 0 0 1 3.08 9.48"
        opacity="0.2"
      />
      <path d="M239.35 70.08a13.41 13.41 0 0 0-11.77-9.28l-36.94-2.92l-14.21-33.66a13.51 13.51 0 0 0-24.86 0l-14.21 33.66l-36.94 2.92a13.39 13.39 0 0 0-7.66 23.58l28.06 23.68l-8.56 35.39a13.32 13.32 0 0 0 5.1 13.91a13.51 13.51 0 0 0 15 .69L164 139l31.65 19.06a13.54 13.54 0 0 0 15-.69a13.34 13.34 0 0 0 5.09-13.91l-8.56-35.39l28.06-23.68a13.32 13.32 0 0 0 4.11-14.31M193.08 99a8 8 0 0 0-2.61 8l8.28 34.21l-30.62-18.41a8 8 0 0 0-8.25 0l-30.62 18.43l8.28-34.23a8 8 0 0 0-2.62-8L108 76.26l35.52-2.81a8 8 0 0 0 6.74-4.87L164 35.91l13.79 32.67a8 8 0 0 0 6.74 4.87l35.53 2.81Zm-105 24.18l-58.42 58.48a8 8 0 0 1-11.32-11.32l58.45-58.45a8 8 0 0 1 11.32 11.32Zm10.81 49.87a8 8 0 0 1 0 11.31l-53.23 53.3a8 8 0 0 1-11.32-11.32l53.27-53.26a8 8 0 0 1 11.31 0Zm73-1a8 8 0 0 1 0 11.32l-54.28 54.28a8 8 0 0 1-11.32-11.32l54.29-54.28a8 8 0 0 1 11.36.01Z" />
    </g>
  </BaseIcon>
);

export const MicroscopeIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M136 32v104a8 8 0 0 1-8 8H80a8 8 0 0 1-8-8V32a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8"
        opacity="0.2"
      />
      <path d="M224 208h-20.06A88.05 88.05 0 0 0 144 64.37V32a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v104a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16V80.46A72 72 0 0 1 181.25 208H32a8 8 0 0 0 0 16h192a8 8 0 0 0 0-16m-96-72H80V32h48zm-56 48a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16Z" />
    </g>
  </BaseIcon>
);

export const SpeedometerIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M232 152a103.9 103.9 0 0 1-5.9 34.63a8 8 0 0 1-7.57 5.37H37.46a8.05 8.05 0 0 1-7.57-5.41a104 104 0 0 1-5.89-35.4C24.44 94 71.73 47.49 129 48a104 104 0 0 1 103 104"
        opacity="0.2"
      />
      <path d="m114.34 154.34l96-96a8 8 0 0 1 11.32 11.32l-96 96a8 8 0 0 1-11.32-11.32M128 88a63.9 63.9 0 0 1 20.44 3.33a8 8 0 1 0 5.11-15.16a80 80 0 0 0-105.06 84.71a8 8 0 0 0 7.94 7.12c.29 0 .59 0 .89-.05a8 8 0 0 0 7.07-8.83A65 65 0 0 1 64 152a64.07 64.07 0 0 1 64-64m99.74 13a8 8 0 0 0-14.24 7.3a96.27 96.27 0 0 1 5 75.71l-181.1-.07A96.24 96.24 0 0 1 128 56h.88a95 95 0 0 1 42.82 10.5a8 8 0 1 0 7.3-14.23A110.8 110.8 0 0 0 129 40h-1A112.05 112.05 0 0 0 22.35 189.25A16.07 16.07 0 0 0 37.46 200h181.07a16 16 0 0 0 15.11-10.71a112.35 112.35 0 0 0-5.9-88.3Z" />
    </g>
  </BaseIcon>
);

export const MonitorIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M224 64v112a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16V64a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16"
        opacity="0.2"
      />
      <path d="M208 40H48a24 24 0 0 0-24 24v112a24 24 0 0 0 24 24h160a24 24 0 0 0 24-24V64a24 24 0 0 0-24-24m8 136a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V64a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8Zm-48 48a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m-10.34-117.66a8 8 0 0 1-11.32 11.32L136 107.31V152a8 8 0 0 1-16 0v-44.69l-10.34 10.35a8 8 0 0 1-11.32-11.32l24-24a8 8 0 0 1 11.32 0Z" />
    </g>
  </BaseIcon>
);

export const ProjectorIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path d="M208 72v112H48V72Z" opacity="0.2" />
      <path d="M88 144v-16a8 8 0 0 1 16 0v16a8 8 0 0 1-16 0m40 8a8 8 0 0 0 8-8v-24a8 8 0 0 0-16 0v24a8 8 0 0 0 8 8m32 0a8 8 0 0 0 8-8v-32a8 8 0 0 0-16 0v32a8 8 0 0 0 8 8m56-72v96h8a8 8 0 0 1 0 16h-88v17.38a24 24 0 1 1-16 0V192H32a8 8 0 0 1 0-16h8V80a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16v16a16 16 0 0 1-16 16m-80 152a8 8 0 1 0-8 8a8 8 0 0 0 8-8M40 64h176V48H40Zm160 16H56v96h144Z" />
    </g>
  </BaseIcon>
);

export const PackageIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M128 129.09V232a8 8 0 0 1-3.84-1l-88-48.18a8 8 0 0 1-4.16-7V80.18a8 8 0 0 1 .7-3.25Z"
        opacity="0.2"
      />
      <path d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.34 44l-29.77 16.3l-80.35-44Zm0 88L47.66 76l33.9-18.56l80.34 44ZM40 90l80 43.78v85.79l-80-43.75Zm176 85.78l-80 43.79v-85.75l32-17.51V152a8 8 0 0 0 16 0v-44.45L216 90v85.77Z" />
    </g>
  </BaseIcon>
);

export const CatIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <g fill="currentColor">
      <path
        d="M224 48v88c0 48.6-43 88-96 88s-96-39.4-96-88V48a8 8 0 0 1 13.66-5.66L67.6 67.6a102.87 102.87 0 0 1 120.8 0l21.94-25.24A8 8 0 0 1 224 48"
        opacity={0.2}
      ></path>
      <path d="M96 140a12 12 0 1 1-12-12a12 12 0 0 1 12 12m76-12a12 12 0 1 0 12 12a12 12 0 0 0-12-12m60-80v88c0 52.93-46.65 96-104 96S24 188.93 24 136V48a16 16 0 0 1 27.31-11.31c.14.14.26.27.38.41L69 57a111.22 111.22 0 0 1 118.1 0l17.21-19.9c.12-.14.24-.27.38-.41A16 16 0 0 1 232 48m-16 0l-21.56 24.8a8 8 0 0 1-10.81 1.2A89 89 0 0 0 168 64.75V88a8 8 0 1 1-16 0V59.05a97.4 97.4 0 0 0-16-2.72V88a8 8 0 1 1-16 0V56.33a97.4 97.4 0 0 0-16 2.72V88a8 8 0 1 1-16 0V64.75A89 89 0 0 0 72.37 74a8 8 0 0 1-10.81-1.17L40 48v88c0 41.66 35.21 76 80 79.67v-20.36l-13.66-13.66a8 8 0 0 1 11.32-11.31L128 180.68l10.34-10.34a8 8 0 0 1 11.32 11.31L136 195.31v20.36c44.79-3.69 80-38 80-79.67Z"></path>
    </g>
  </BaseIcon>
);

export const PlusIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <path
      fill="currentColor"
      d="M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8"
    ></path>
  </BaseIcon>
);
export const OptionsIcon: ComponentWithAs<"svg", IconProps> = (props) => (
  <BaseIcon {...props}>
    <path
      d="M152 128a24 24 0 1 1-24-24a24 24 0 0 1 24 24M48 104a24 24 0 1 0 24 24a24 24 0 0 0-24-24m160 0a24 24 0 1 0 24 24a24 24 0 0 0-24-24"
      opacity={0.2}
    ></path>
    <path d="M128 96a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16M48 96a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16m160-48a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16"></path>
  </BaseIcon>
);

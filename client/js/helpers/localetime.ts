import dayjs from "dayjs";

export default (time: Date | number) => dayjs(time).format("D MMMM YYYY, HH:mm:ss");

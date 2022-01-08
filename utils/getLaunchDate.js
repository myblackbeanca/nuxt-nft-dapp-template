export default function getLaunchDate() {
    const stdTimezoneOffset = () => {
      const jan = new Date(0, 1);
      const jul = new Date(6, 1);
      return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    }

    const isDstObserved = (today) => {
      return today.getTimezoneOffset() < stdTimezoneOffset()
    }

    const today = new Date();
    const tz = isDstObserved(today) ? 4:5

    // console.log(this.$route.path, this.$route.path.includes('presalemint'))

    const result = this.$route.path.includes('presalemint')
      ? new Date(`2021-12-10T18:00:00-0${tz}:00`)
      : new Date(`2021-12-11T18:00:00-0${tz}:00`)

    console.log("Mint date", result.toLocaleString())

    return result;

    // return new Date('2021-12-11').toLocaleString("en-US", {timeZone: "America/New_York"})
  }

const base = function (type, str) {
  console[type](str);
}

const info = function (str) {
  base("info", str);
}

const warn = function (str) {
  base("warn", str);
}

const error = function (str) {
  base("error", str);
}


const log = {
  info,
  warn,
  error
}

export default log;
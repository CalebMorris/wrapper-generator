
/*
 * Author: Vlad Alexandru Ionescu
 * Description: Strips function name
 * @param {Func} func - Function to have name extracted
 * @returns {String} - Function name
 */
function stripFunctionName(fun) {
  let ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

export default { stripFunctionName };


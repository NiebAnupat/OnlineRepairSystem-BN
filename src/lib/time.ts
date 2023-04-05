const getCurrentTime = () => {
  // get current time in thai timezone
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  return new Date(Date.now() - tzoffset);
};

export default getCurrentTime;
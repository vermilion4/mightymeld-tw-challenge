export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block size-10 sm:size-16 lg:size-20 bg-indigo-300 text-center rounded-lg cursor-pointer hover:ring-2 ring-indigo-200 transition-all duration-300 ease-out"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block size-10 sm:size-16 lg:size-20 bg-indigo-500 p-2 rounded-lg text-white dark:bg-gradient-to-b dark:from-indigo-500 dark:to-indigo-600">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block size-10 sm:size-16 p-2 lg:size-20 text-indigo-200 dark:text-indigo-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return <div onClick={flip} className={className}></div>;
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}

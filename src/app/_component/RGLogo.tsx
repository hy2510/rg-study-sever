export default function RGLogo({ isWhite }: { isWhite?: boolean }) {
  if (isWhite) {
    return <span style={{ color: "white" }}>ReadingGate</span>;
  }
  return (
    <>
      <span style={{ color: "#0c4da2" }}>R</span>
      <span style={{ color: "#8fc851" }}>e</span>
      <span style={{ color: "#faa61a" }}>a</span>
      <span style={{ color: "#f28396" }}>d</span>
      <span style={{ color: "#a8a89e" }}>i</span>
      <span style={{ color: "#a8a89e" }}>n</span>
      <span style={{ color: "#a8a89e" }}>g</span>
      <span style={{ color: "#00adee" }}>G</span>
      <span style={{ color: "#a8a89e" }}>a</span>
      <span style={{ color: "#a8a89e" }}>t</span>
      <span style={{ color: "#a8a89e" }}>e</span>
    </>
  );
}

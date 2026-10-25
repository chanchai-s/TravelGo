export async function switchMode(args: any) {
  const { mode } = args;

  if (!["rental", "ride"].includes(mode)) {
    return {
      content: [{ type: "text", text: JSON.stringify({ error: "Invalid mode. Use 'rental' or 'ride'." }, null, 2) }],
      isError: true
    };
  }

  return {
    content: [{ type: "text", text: JSON.stringify({
      success: true,
      mode,
      message: `Switched to ${mode} mode`
    }, null, 2) }]
  };
}
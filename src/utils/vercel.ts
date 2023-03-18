const vercelToken = import.meta.env.VERCEL_TOKEN || "";

export const getRealtimeUV = async () => {
  try {
    const res = await fetch(
      `https://api.vercel.com/v6/web/insights/realtime?projectId=qa`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: vercelToken,
        },
        method: "GET",
      }
    );
    if (res.status === 200) {
      const resJson = await res.json();
      return resJson.devices;
    }
    return "10000";
  } catch (error) {
    return `寄了`;
  }
};

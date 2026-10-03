export const access = "public";

export default async function (req, res) {
  res.json({
    status: "ok",
    service: "NOPE Pine Labs Mock",
    version: "1.0.0"
  });
}
import app from "./app.js";
import pc from "picocolors";
const PORT = 3000;
app.listen(PORT, () => {
    console.log(pc.green(`Server is running on: `) + pc.yellow(`http://localhost:${PORT}`));
});
//# sourceMappingURL=server.js.map
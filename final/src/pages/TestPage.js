import WinScreen from "../components/WinScreen";
import GameEndScreen from "../components/WinScreen";

const testPage = () =>{
    return (
        <GameEndScreen status={"lose"} cpuScore={10} playerScore={10}/>
    );
}
export default testPage;

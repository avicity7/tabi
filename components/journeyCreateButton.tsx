import { PencilSimple } from 'phosphor-react';
import { useRouter } from "next/router";
const JourneyCreateButton = () => {
    const router = useRouter();
    return ( 
        <div className = "fixed bottom-0 w-screen flex justify-end px-6 md:px-10 py-10">
            <button className="w-12 h-12 rounded-full bg-white hover:bg-white shadow-md" onClick={()=>{router.push("/creation")}}>
                <PencilSimple color="#268DC7" size="26" className = "mx-auto"/>
            </button>
        </div>
    )
}

export default JourneyCreateButton
import React,{useState} from 'react'
import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import styles from "./EditLanguage.module.css"
import SelectLauguage from "./Step1/Step1";
import AnimatedButton from '../AnimatedButton/AnimatedButton'
import { useNavigate } from 'react-router-dom';
import decodeToken from '../../lib/decodeToken';
import { useAgentCreator } from '../../hooks/useAgentCreator';
import PopUp from '../Popup/Popup';
import { useDashboardStore } from '../../Store/agentZustandStore';


function EditLanguage() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [Loading, setLoading] = useState(null);
    const navigate=useNavigate();
    const { setHasFetched } =    useDashboardStore();   

    const token = localStorage.getItem("token");
    const decodeTokenData = decodeToken(token);
    const userId = decodeTokenData?.id;
    const agentnm=sessionStorage.getItem("agentName");

      const { handleCreateAgent } = useAgentCreator({
      stepValidator: () => "EditLanguage",
      setLoading,
      setPopupMessage,
      setPopupType,
      setShowPopup,
      navigate,
      setHasFetched,
    });

  const handleClick=()=>{
    handleCreateAgent();
  }

  return (
    <div>
        
            <EditHeader title='Edit Agent ' agentName={agentnm} />
            <div className={styles.Maindiv}>
                <SectionHeader
                    heading="Select Language"
                    subheading="Select the Primary Language, You want your agent to speak"
                    highlight=""
                />

            </div>

            <div className={styles.container}>

          <SelectLauguage />
</div>

    <div className={styles.stickyWrapper} onClick={handleClick}>
      <AnimatedButton label="Save" isLoading={Loading} />
    </div>
    {showPopup && (
            <PopUp
            type={popupType}
            onClose={()=>{setShowPopup(false)}}
            message={popupMessage}
            onConfirm={()=>navigate('/edit-services-offered')}
            />
        )}
    </div>
  )
}

export default EditLanguage
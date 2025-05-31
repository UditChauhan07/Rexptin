import React, { useState } from 'react';
import styles from '../../Component/RexAgent/RexAgent.module.css';

const RexAgent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inCall, setInCall] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => setIsModalOpen(false);
    const handleCallClick = () => setInCall(prev => !prev);

    return (
        <>
            <div
                className={`${styles.raxAgentdiv} ${isModalOpen ? styles.noFloat : ''}`}
                onClick={handleOpenModal}
                style={{ cursor: 'pointer' }}
            >
                <img src='images/RexAi.png' alt='rex-agent' className={styles.rexImage} />
                <div className={styles.dot}></div>
            </div>


            <div className={`${styles.inlogo} ${isModalOpen ? styles.noFloatInlogo : ''}`} onClick={handleOpenModal}>
                <img src='svg/inlogo.svg' alt='inlogo' />
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div
                        className={`${styles.modalContent}`}
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className={styles.closeBtn} onClick={handleCloseModal}>
                            {/* <img src='svg/REX Support2.svg'/> */}
                            ×
                        </div>
                        <div className={styles.container}>
                            <a href='https://www.rexpt.in/' target="_blank" className={styles.Powered}>Powered by rexpt.in</a>
                            <div className={styles.imgrex}>
                                <img src="images/RexAi.png" alt="Rex Agent" />
                                <div className={styles.cornerOverlay}></div>
                                <div
                                    className={inCall ? styles.reddiv : styles.greendiv}
                                    onClick={handleCallClick}
                                >
                                    <div className={styles.phoneIcon}>
                                        <img
                                            src={inCall ? "svg/Hangup.svg" : "svg/Phone-call.svg"}
                                            alt="Phone Icon"
                                        />
                                    </div>
                                    <div className={styles.callText}>
                                        {inCall ? (
                                            <>
                                                <p>Hang up Now</p>
                                                <small>In Call with [AGENT NAME]</small>
                                            </>
                                        ) : (
                                            <>
                                                <p>
                                                    Call <span className={styles.agentTag}>[AGENT]</span>
                                                </p>
                                                <small>[BUSINESS NAME] Agent is LIVE</small>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RexAgent;

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./Step4.module.css";
const Step4 = forwardRef(
  (
    {
      onNext,
      onBack,
      onValidationError,
      loading,
      setLoading,
      detectRoleTypeChange,


    },

    ref
  ) => {
    const [agentNote, setAgentNote] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    useEffect(() => {
      const storedAgentRole = sessionStorage.getItem("agentRole");
      const storedNote = sessionStorage.getItem("agentNote");


      if (storedAgentRole) {
        setSelectedRole(storedAgentRole);
      }
      if (storedNote) {
        setAgentNote(storedNote);
      }
    }, []);

    // Persist on change
    useEffect(() => {
      sessionStorage.setItem("agentRole", selectedRole);
    }, [selectedRole]);
    useEffect(() => {
      sessionStorage.setItem("agentNote", agentNote);
    }, [agentNote]);

    // Pass validation and note back to parent
    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!selectedRole?.trim()) {
          onValidationError?.({
            type: "failed",
            message: "Please select a Receptionist Type!",
          });
          return false;
        }

        return {
          isValid: true,
          agentNote: agentNote.trim(),
        };

      },
    }));
    const roles = [
      {
        title: "General Receptionist",
        description:
          "A general receptionist will pick calls, provide information on your services and products, take appointments and guide callers.",
      },
      {
        title: "LEAD Qualifier",
        description:
          "A LEAD Qualifier handles inbound sales queries and helps identify potential leads for your business.",
      },
    ];

    return (
      <>
        <div className={`${styles.container} ${loading ? styles.blocked : ""}`}>
          {roles.map((role, index) => (
            <label
              key={index}
              className={`${styles.card} ${selectedRole === role.title ? styles.selected : ""
                }`}
            >
              <div className={styles.forflex}>
                <div className={styles.info}>
                  <p className={styles.title}>{role.title}</p>

                </div>
                <div>
                  <input
                    type="radio"
                    name="receptionist"
                    value={role.title}
                    checked={selectedRole === role.title}
                    onChange={() => {
                      setSelectedRole(role.title);
                    //   detectRoleTypeChange(role?.title);
                    }}
                    className={styles.radio}
                  />
                  {/* <span className={styles.customRadio}></span> */}
                </div>

              </div>

            </label>

          ))}


        </div>
        {selectedRole && (
          <p className={styles.LastP}>
            {
              roles.find((role) => role?.title === selectedRole)?.description
            }
          </p>
        )}
      </>

    );
  }
);

export default Step4;

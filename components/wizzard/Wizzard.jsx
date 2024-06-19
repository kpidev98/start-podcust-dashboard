"use client";
import { useState, useEffect } from "react";
import styles from "./Wizzard.module.scss";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import { useMemberstack } from "@memberstack/nextjs/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
let isDraft;
const stepsArray = [
  "1/9",
  "2/9",
  "3/9",
  "4/9",
  "5/9",
  "6/9",
  "7/9",
  "8/9",
  "9/9",
];

const initialFormData = {
  typeOfVideo: "",
  title: "",
  description: "",
  timing: "",
  format: "",
  links: "",
  soundtrack: "",
  deadline: "",
  status: "",
  files: [],
  uploadedtrack: [],
};

function Wizzard() {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState("1/9");
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fainalLoading, setFinalLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const router = useRouter();
  const memberstack = useMemberstack();
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data: member } = await memberstack.getCurrentMember();
        setUser(member);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    fetchMember();
  }, []);

  const projectId = user?.id;
  const plan = user?.planConnections[0].planId;

  const epicData = {
    name: `${user?.customFields["first-name"]} ${user?.customFields["last-name"]}-id:${user?.id}`,
    group_ids: ["65ca3851-9e90-4234-b79f-4cb2cb414cc9"],
    external_id: user?.id,
  };

  const nameForFrameIo = epicData.name;

  const handleDeleteLink = (linkName) => {
    const updatedFormData = { ...formData };
    updatedFormData.links = updatedFormData.links.filter(
      (link) => link !== linkName
    );
    setFormData(updatedFormData);
  };

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    const currentStepIndex = stepsArray.indexOf(currentStep);
    setCurrentStep(stepsArray[currentStepIndex + 1]);
  };

  const handlePrevStep = () => {
    const currentStepIndex = stepsArray.indexOf(currentStep);
    const prevStep = stepsArray[currentStepIndex - 1];

    // Забираємо стилі з попереднього кроку, який не є поточним або завершеним
    setCompletedSteps(completedSteps.filter((step) => step !== prevStep));

    setCurrentStep(prevStep);
  };

  const handleChangeInput1 = (value) => {
    setFormData({
      ...formData,
      typeOfVideo: value,
    });
  };

  const handleChangeInput2 = (value) => {
    setFormData({
      ...formData,
      title: value,
    });
  };

  const handleChangeInput3 = (value) => {
    setFormData({
      ...formData,
      description: value,
    });
  };

  const handleChangeInput4 = (value) => {
    setFormData({
      ...formData,
      timing: value,
    });
  };

  const handleChangeInput5 = (value) => {
    setFormData({
      ...formData,
      format: value,
    });
  };

  const handleChangeInput6 = (value) => {
    setFormData({
      ...formData,
      links: value,
    });
  };

  const handleChangeInputTrack = (uploadedtrack, soundtrack) => {
    setFormData({
      ...formData,
      uploadedtrack: uploadedtrack,
      soundtrack: soundtrack,
    });
  };
  const handleChangeInput8 = (value) => {
    setFormData({
      ...formData,
      deadline: value,
    });
  };

  const handleChangeInput9 = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      links: [...prevState.links, value],
    }));
  };

  const handleSubmitFormData = async (isDraft) => {
    setFinalLoading(true);

    try {
      const dynamic = await fetch(`/api/getepicsname`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!dynamic.ok) {
        setFinalLoading(false);
        throw new Error("Failed to fetch epics");
      }

      const epicsObject = await dynamic.json();

      let existEpicId;
      let newEpicId;

      const existEpic = epicsObject.find(
        (object) => object.name === epicData.name
      );

      if (existEpic) {
        existEpicId = existEpic ? existEpic.id : null;
        console.log(existEpicId);
      } else {
        const res = await axios.post("/api/epicshortcut", epicData);
        if (res.status !== 200) {
          setFinalLoading(false);
          throw new Error(await res.text());
        }
        const { id } = res.data;

        newEpicId = id;
      }

      const finalEpicId = existEpic ? existEpicId : newEpicId;
      const frameIoData = {
        name: nameForFrameIo,
      };
      const resprojectframeio = await fetch("/api/getprojectframeio", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resprojectframeio.ok) {
        setFinalLoading(false);
        throw new Error("Failed to fetch frameio projects");
      }
      const projectData = await resprojectframeio.json();
      const existProject = projectData.find(
        (object) => object.name === frameIoData.name
      );
      if (!existProject) {
        const resio = await fetch("/api/frameioproject", {
          method: "POST",
          body: JSON.stringify(frameIoData),
        });

        if (!resio.ok) {
          setFinalLoading(false);
          throw new Error(await resio.text());
        }
      }

      let value_idTiming;

      switch (formData.timing) {
        case "1 min":
          value_idTiming = "65ca3c1f-aa86-415c-ad20-d8b5295a551d";
          break;
        case "5 min":
          value_idTiming = "65ca3c1f-0c5e-43fc-8f96-7dfa7306de62";
          break;
        case "10 min":
          value_idTiming = "65ca3c1f-664a-481a-a54b-211fc65ed827";
          break;
        case "15 min":
          value_idTiming = "65ca3c1f-cd95-408e-9798-f17b3d6da301";
          break;
        case "20 min":
          value_idTiming = "65ca3c1f-efd4-4ee2-b489-f53c13bfb32f";
          break;
        case "30 min":
          value_idTiming = "65ca3c1f-30e3-42d9-8af9-0776443e0a2e";
          break;
        case "40 min":
          value_idTiming = "65ca3c1f-5c66-474d-a827-42fad5d99cf2";
          break;
        case "50 min":
          value_idTiming = "65ca3c1f-022b-4ff8-8125-6917c90d2c08";
          break;
        case "60 min":
          value_idTiming = "65ca3c1f-064a-486b-931b-b425ea488629";
          break;
        case "70 min":
          value_idTiming = "65ca3c1f-8166-4ee0-9a13-0b70828a6f56";
          break;
        case "80 min":
          value_idTiming = "65ca3c1f-1e1a-413b-b545-8c6447cba9f4";
          break;
        case "90 min":
          value_idTiming = "65ca3c1f-616c-4e37-a064-53533b010618";
          break;
        case "100 min":
          value_idTiming = "65ca3c1f-55e3-4b97-b40c-97b4689c915c";
          break;
        // Додайте інші варіанти за потреби
        default:
          // Значення за замовчуванням, якщо не відповідає жодному з варіантів
          value_idTiming = "default_id";
          break;
      }
      let value_idTypeVideo;

      switch (formData.typeOfVideo) {
        case "Video Tutorials":
          value_idTypeVideo = "65ca3abe-720d-428a-a16e-b2570d85347f";
          break;
        case "Ask Me Anything (AMA) Videos":
          value_idTypeVideo = "65ca3abe-e393-4d5b-abbd-9dff5e067887";
          break;
        case "Whiteboard Videos":
          value_idTypeVideo = "65ca3abe-da84-4738-b333-0622b0031675";
          break;
        case "Listicle Videos":
          value_idTypeVideo = "65ca3abe-7dd7-4a4e-bf4c-049af3a7785e";
          break;
        case "Product Reviews":
          value_idTypeVideo = "65ca3abe-c17e-4e4e-9f53-a1134845bfac";
          break;
        case "Educational Videos":
          value_idTypeVideo = "65ca3abe-1c21-4557-a1a8-bbad6a282b6f";
          break;
        case "Challenge Videos":
          value_idTypeVideo = "65ca3abe-9a93-4cec-9f98-4851790d2ec7";
          break;
        case "Unboxing Videos":
          value_idTypeVideo = "65ca3b75-4e2d-458d-bf05-7cb57cee4139";
          break;
        case "Explainer Videos":
          value_idTypeVideo = "65ca3b75-c5e6-4af1-a580-aa4993c9f777";
          break;
        case "BTS Videos":
          value_idTypeVideo = "65ca3b75-c044-4b7c-aafc-5da1a0b04205";
          break;
        case "Product Demo Videos":
          value_idTypeVideo = "65ca3b75-53c5-442a-b540-22bd35d744e3";
          break;
        case "Reaction Videos":
          value_idTypeVideo = "65ca3b75-2e12-471d-9e9b-1bfbbe7554fa";
          break;
        case "Webinar Teasers":
          value_idTypeVideo = "65ca3b75-d84c-4579-b449-7de7eed940d2";
          break;
        case "Community-Based Videos":
          value_idTypeVideo = "65ca3b75-984b-4959-944f-885f1be1ebbf";
          break;
        case "Business Results Videos":
          value_idTypeVideo = "65ca3b75-fc6c-41b3-94c1-9b984d1c8ec0";
          break;
        case "Meet the Team Videos":
          value_idTypeVideo = "65ca3b75-f1ed-4263-a101-bd44594fa380";
          break;
        case "Employee Spotlight Videos":
          value_idTypeVideo = "65ca3b75-53cb-429d-8d31-0dc0f267d1be";
          break;
        case "Company Values Videos":
          value_idTypeVideo = "65ca3b75-eb69-4740-b5a0-d64fbf2df8d7";
          break;
        case "Q&A Videos":
          value_idTypeVideo = "65ca3b75-7a66-43a7-84b5-7366ce27619d";
          break;
        case "Company Culture Videos":
          value_idTypeVideo = "65ca3b75-e3ff-4f29-921f-2ce3d8636cc0";
          break;
        case "Video Blogs (Vlogs)":
          value_idTypeVideo = "65ca3b75-4083-49b5-8e62-ff691615da5e";
          break;
        case "Product Launch Videos":
          value_idTypeVideo = "65ca3b75-36d9-492a-a4ad-2e8a2cec5e4a";
          break;
        case "Video Podcasts":
          value_idTypeVideo = "65ca3b75-1c34-49a5-8e6f-ee3187098c58";
          break;
        case "Video Testimonials":
          value_idTypeVideo = "65ca3b75-8295-46c4-a421-adce327b9b1f";
          break;
        // Додайте інші варіанти за потреби
        default:
          // Значення за замовчуванням, якщо не відповідає жодному з варіантів
          value_idTypeVideo = "default_id";
          break;
      }
      let value_idSoundtrack;
      switch (formData.soundtrack) {
        case "Yes":
          value_idSoundtrack = "65ca3cc6-4911-4888-9486-e67732c426bd";
          break;
        case "No":
          value_idSoundtrack = "65ca3cc6-8d96-4c2d-abd1-2273dda9b961";
          break;
        default:
          // Значення за замовчуванням, якщо не відповідає жодному з варіантів
          value_idSoundtrack = "default_id";
          break;
      }
      let valueFormatId;
      switch (formData.format) {
        case "horizontal 16:9":
          valueFormatId = "65ca3c8a-2057-4a96-9ce5-6b3cfa9790a1";
          break;
        case "vertical 9:16":
          valueFormatId = "65ca3c8a-47f5-41b3-beff-f1267065c378";
          break;
        case "horizontal 16:9 and vertical 9:16":
        case "vertical 9:16 and horizontal 16:9":
          valueFormatId = "66164864-d6b3-47c7-a124-a3307356916e";
          break;
        default:
          // Значення за замовчуванням, якщо не відповідає жодному з варіантів
          valueFormatId = "default_id";
          break;
      }

      const requestData = {
        name: formData.title,
        description: formData.description,
        external_id: projectId,
        epic_id: finalEpicId,
        group_id: "65ca3851-9e90-4234-b79f-4cb2cb414cc9",
        workflow_state_id: isDraft ? 500000041 : 500000042,
        requested_by_id: "65bf6a3d-5d07-4db8-82c1-c1e7c30f8c18",
        deadline: formData.deadline,
        owner_ids: ["6606e52b-218a-4584-8906-1eb84585516d"],
        custom_fields: [
          {
            field_id: "65ca3c1f-9a4b-40e3-8a96-2f1bdb5579c2",
            value: formData.timing,
            value_id: value_idTiming,
          },
          {
            field_id: "65ca3abe-f5b0-43a0-a14d-b5704f658d4d",
            value: formData.typeOfVideo,
            value_id: value_idTypeVideo,
          },
          {
            field_id: "65ca3cc6-d321-42b9-9ddf-354bf5817fea",
            value: formData.soundtrack,
            value_id: value_idSoundtrack,
          },
          {
            field_id: "65ca3c8a-3838-4cc7-8f47-4e20c848f6bb",
            value: formData.format,
            value_id: valueFormatId,
          },
        ],
      };

      const requestDataWithExternalLinks = {
        ...requestData,
        external_links: formData.links,
      };
      const hasValidExternalLinks =
        Array.isArray(formData.links) &&
        formData.links.length > 0 &&
        formData.links.every((link) => link.trim() !== "");

      const postData = hasValidExternalLinks
        ? requestDataWithExternalLinks
        : requestData;

      const response = await axios.post("/api/newproject", postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const projectIdDb = response.data.id;
      const dbProject = {
        name: formData.title,
        type: formData.typeOfVideo,
        description: formData.description,
        time: formData.timing,
        format: formData.format,
        links: hasValidExternalLinks ? formData.links : null,
        soundtrack: formData.soundtrack,
        deadline: formData.deadline,
        status: formData.status,
        id: projectId,
        storyId: projectIdDb,
        files: uploadedFileNames,
        uploadedtrack: formData.uploadedtrack,
      };

      const responsedb = await axios.post("/api/createprojectdb", dbProject, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (responsedb.status === 200) {
        setFinalLoading(false);
        toast.success("Thank you  project was created");
        router.push("/dashboard/projects", { scroll: false });
      } else {
        setFinalLoading(false);
        toast.error("Faild to create project, try again please");
      }
    } catch (error) {
      setFinalLoading(false);
      console.error("error creating story:", error);
    }
  };

  return (
    <div className={styles.wizzard_main_container}>
      <section className={`${styles.wizzard_section} `}>
        {stepsArray.map((item) => (
          <div
            key={item}
            className={`${styles.wizzard_item} ${
              completedSteps.includes(item) ? styles.completed : ""
            } ${item === currentStep ? styles.active : ""}`}
          >
            {item}
          </div>
        ))}
      </section>

      {/* Render Steps */}
      {currentStep === "1/9" && (
        <Step1
          formData={formData}
          handleChangeInput={handleChangeInput1}
          handleNextStep={handleNextStep}
        />
      )}
      {currentStep === "2/9" && (
        <Step2
          formData={formData}
          handleChangeInput={handleChangeInput2}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
        />
      )}
      {currentStep === "3/9" && (
        <Step3
          formData={formData}
          handleChangeInput={handleChangeInput3}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
        />
      )}
      {currentStep === "4/9" && (
        <Step4
          formData={formData}
          handleChangeInput={handleChangeInput4}
          handlePrevStep={handlePrevStep}
          handleSubmitFormData={handleSubmitFormData}
          handleNextStep={handleNextStep}
        />
      )}
      {currentStep === "5/9" && (
        <Step5
          formData={formData}
          handleChangeInput={handleChangeInput5}
          handlePrevStep={handlePrevStep}
          handleSubmitFormData={handleSubmitFormData}
          handleNextStep={handleNextStep}
        />
      )}
      {currentStep === "6/9" && (
        <Step6
          formData={formData}
          handleChangeInput={handleChangeInput6}
          handlePrevStep={handlePrevStep}
          handleSubmitFormData={handleSubmitFormData}
          handleNextStep={handleNextStep}
        />
      )}
      {currentStep === "7/9" && (
        <Step7
          formData={formData}
          handlePrevStep={handlePrevStep}
          handleSubmitFormData={handleSubmitFormData}
          handleNextStep={handleNextStep}
          nameForFrameIo={nameForFrameIo}
          handleChangeInputTrack={handleChangeInputTrack}
        />
      )}
      {currentStep === "8/9" && (
        <Step8
          formData={formData}
          handleChangeInput={handleChangeInput8}
          handlePrevStep={handlePrevStep}
          handleSubmitFormData={handleSubmitFormData}
          handleNextStep={handleNextStep}
        />
      )}
      {currentStep === "9/9" && (
        <Step9
          formData={formData}
          handleChangeInput={handleChangeInput9}
          handlePrevStep={handlePrevStep}
          handleSubmitFormData={handleSubmitFormData}
          handleNextStep={handleNextStep}
          nameForFrameIo={nameForFrameIo}
          handleDeleteLink={handleDeleteLink}
          isDraft={isDraft}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          fainalLoading={fainalLoading}
          setFinalLoading={setFinalLoading}
          setUploadedFileNames={setUploadedFileNames}
          uploadedFileNames={uploadedFileNames}
          plan={plan}
        />
      )}
    </div>
  );
}

export default Wizzard;

"use client";

import { useState, useEffect } from "react";
import AsideBar from "@/components/AsideBar";
import styles from "./ProjectComponent.module.scss";
import Link from "next/link";
import DashboardBurgerMenu from "@/components/DashboardMenu";
import {
  useMemberstack,
  MemberstackProtected,
} from "@memberstack/nextjs/client";
import { inter } from "@/app/fonts";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import statuses from "@/data/statusList";

function ProjectComponenet() {
  const [searchTerm, setSearchTerm] = useState(" ");
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [filterData, setFilterData] = useState();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [user, setUser] = useState(null);

  const memberstack = useMemberstack();
  const router = useRouter();
  const n = 4;
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

  useEffect(() => {
    if (user?.id) {
      fetchProjects(user.id);
    }
  }, [user, page, selectedStatus]);

  async function fetchProjects(userId) {
    try {
      const response = await axios.get(`/api/getallprojectdb?userId=${userId}`);
      const data = response.data;
      setProjects(data);
      if (selectedStatus !== "") {
        // Виконуємо функцію, якщо обраний статус не дорівнює пустій строкі
        const filteredData = data.filter(
          (item) => item.status === selectedStatus // Фільтрація за обраним статусом
        );
        // Перевірка, чи немає проектів з обраним статусом
        if (filteredData.length === 0) {
          toast.info("Projects with such status do not exist");
          return; // Повертаємося, не встановлюючи значення filterData
        }
        setFilterData(filteredData.slice(page * n, (page + 1) * n));
      } else {
        setFilterData(data.slice(page * n, (page + 1) * n)); // Встановлюємо всі проекти
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };
  const unathorizedRedirect = () => {
    router.push("https://www.indiev.org/access-denied");
  };
  return (
    <MemberstackProtected
      allow={{
        plans: [
          "pln_startup-h07f0gob",
          "pln_weekly-va6j01w1",
          "pln_boost-cw7h0gp5",
        ],
      }}
      onUnauthorized={unathorizedRedirect}
    >
      <div className={styles.flex_container}>
        <div className={styles.asidebar_container}>
          <AsideBar />
        </div>
        <div className={styles.full_width}>
          <div className={styles.header_container}>
            <h1
              className={`${styles.header_container_text} ${inter.className}`}
            >
              Projects
            </h1>
            <div className={styles.dashboard_burger_container}>
              <DashboardBurgerMenu />
            </div>
          </div>
          <div
            className={`${styles.project_links_container} ${inter.className}`}
          >
            <div
              className={`${styles.project_container_first} ${styles.project_container_first_mobile}`}
            >
              <Link href="#" className={styles.project_link_all}>
                All projects
              </Link>
              <div>
                <form
                  onSubmit={handleSubmit}
                  className={styles.project_input_form}
                >
                  <div className={styles.project_search_icon_container}>
                    <button
                      className={styles.project_search_button}
                      type="submit"
                    >
                      <div>
                        <svg
                          className={styles.navigation_icon}
                          width="20"
                          height="20"
                        >
                          <use href="/assets/icons.svg#icon-search"></use>
                        </svg>
                      </div>
                    </button>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleChange}
                      className={styles.project_search_input}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className={styles.project_container_first}>
              <select
                className={styles.project_select_filter}
                onChange={(event) => handleStatusSelect(event.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Link href="/newproject" className={styles.project_link_new}>
                New Project
              </Link>
            </div>
          </div>
          {projects.length > 0 && (
            <>
              <ul className={styles.card}>
                {filterData?.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </ul>
              <div className={styles.blog_pagination_container}>
                <ReactPaginate
                  containerClassName={styles.blog_pagination}
                  activeClassName={styles.blog_pagination_active}
                  pageClassName={styles.blog_pagination_item}
                  onPageChange={(event) => setPage(event.selected)}
                  breakLabel="..."
                  pageCount={Math.ceil(projects.length / n)}
                  previousLabel={
                    <div className={styles.blog_container_icon}>
                      <svg
                        className={styles.blog_icon_prev}
                        width="25"
                        height="25"
                      >
                        <use href="/assets/icons.svg#icon-ctrl"></use>
                      </svg>
                    </div>
                  }
                  nextLabel={
                    <div className={styles.blog_container_icon}>
                      <svg
                        className={styles.blog_icon_next}
                        width="25"
                        height="25"
                      >
                        <use href="/assets/icons.svg#icon-ctrl"></use>
                      </svg>
                    </div>
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
      //{" "}
    </MemberstackProtected>
  );
}

export default ProjectComponenet;

--
-- PostgreSQL database dump
--

\restrict kZ0Jc8oSwzyIiklphkor9QstebSMkNDLhNcjfXGh6lqu5UqpEpNcXVJRSSzqqWe

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'PARENT',
    'CHILD'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'TODO',
    'DONE'
);


ALTER TYPE public."TaskStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Book" (
    id text NOT NULL,
    title text NOT NULL,
    author text,
    rating integer DEFAULT 3 NOT NULL,
    "readDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "ogDescription" text,
    "ogImage" text,
    "ogTitle" text,
    url text
);


ALTER TABLE public."Book" OWNER TO postgres;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    status public."TaskStatus" DEFAULT 'TODO'::public."TaskStatus" NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."Role" DEFAULT 'CHILD'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Data for Name: Book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Book" (id, title, author, rating, "readDate", "userId", "createdAt", "ogDescription", "ogImage", "ogTitle", url) FROM stdin;
cmk9s20f60001r7r3e81nxk4x	吾輩は猫である	夏目漱石	3	2026-01-11 13:36:15.522	cmk9mq0yv0001jno5y7462zr8	2026-01-11 13:36:15.522	山頂には羽黒山神社があり、「おはぐろさん」の名で親しまれています。神社まで車道もありますが、登山の場合は県道63号沿いの一の鳥居からスタート、約1,600mで神社に到着します。羽黒山の山頂に鎮座する羽黒山神社には「梵天祭」の梵天が奉納されています…	https://www.utsunomiya-cvb.org/lsc/upfile/spot/0001/0043/10043_1_l.jpg	羽黒山神社｜観光スポット｜【公式】宇都宮観光ナビ - 栃木県宇都宮のおでかけ・旅行情報	https://www.utsunomiya-cvb.org/spot/detail_10043.html
cmk9rv32g0001glbl305stivt	吾輩は猫である	夏目漱石	3	2026-01-11 13:30:52.36	cmk9mq0yv0001jno5y7462zr8	2026-01-11 13:30:52.36	\N	\N	\N	https://www.amazon.co.jp/%E5%90%BE%E8%BC%A9%E3%81%AF%E7%8C%AB%E3%81%A7%E3%81%82%E3%82%8B-%E6%96%B0%E8%A3%85%E7%89%88-%E8%AC%9B%E8%AB%87%E7%A4%BE%E9%9D%92%E3%81%84%E9%B3%A5%E6%96%87%E5%BA%AB-%E5%A4%8F%E7%9B%AE-%E6%BC%B1%E7%9F%B3/dp/4062856212/ref=sr_1_1?adgrpid=56948526887&dib=eyJ2IjoiMSJ9.z1If0fluUo0OwSIrqMZLKMyGE7RoLPkY2myZHDC_BJ_5o_04hV9Ce1kSzWArBjutTqEoaNm_102vY_S2ZvuKt4qnk22bynJ1ea52Hvb3iJ6eJhd0_uJ7cl0UXx_-bN6fHBmuUY0K16T2Zq3d4P41H9hu2ZWD5uOIMP7wWMBel-ROeiTZPvW2dosrvYoP3Rc2TKD8cm-2XDJLS9gNrUVClu58Bx8O4qg7pvAGpkN_RnYAWeJUUWXrQZ10PsAGlF_DJS7j_OwTlTYP-UWy1H183WP5DjTTkYJjVwKKBboYTVA.AFjoh_zNxdojZ8Qr1o_rLB7Tcr2spK-9GTBDTVvly2s&dib_tag=se&hvadid=770253348881&hvdev=c&hvexpln=0&hvlocphy=9176776&hvnetw=g&hvocijid=17235750844554576567--&hvqmt=e&hvrand=17235750844554576567&hvtargid=kwd-2177453088704&hydadcr=3860_13501431&jp-ad-ap=0&keywords=amazon+%E5%90%BE%E8%BC%A9+%E3%81%AF+%E7%8C%AB+%E3%81%A7+%E3%81%82%E3%82%8B&mcid=6d6b37a5dac430328da86e5479e5d291&qid=1768138239&sr=8-1
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, title, description, status, "dueDate", "userId", "createdAt", "updatedAt", "completedAt") FROM stdin;
cmk9tv0bv0001zop1250rg56k	本「消えた校長先生」を読む	全171ページ	DONE	2026-01-11 16:28:00	cmk9mq0yv0001jno5y7462zr8	2026-01-11 14:26:48.043	2026-01-11 14:35:44.31	2026-01-11 14:35:44.307
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, password, name, role, "createdAt") FROM stdin;
cmk9mq0yc0000jno5q6a5ft9h	parent	$2b$10$Zj5XZ07n4CNPNf52zzvTf.cWRnUJZAN4h20fXvKXcAaPF8VUqUTwi	お父さん	PARENT	2026-01-11 11:06:58.26
cmk9mq0yv0001jno5y7462zr8	takuma	$2b$10$kxVP9ABXy2kVZviag64pouVkkPyOw9lUkYplHEHo997OcBrJaGtpu	たくまくん	CHILD	2026-01-11 11:06:58.279
\.


--
-- Name: Book Book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Book Book_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Task Task_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict kZ0Jc8oSwzyIiklphkor9QstebSMkNDLhNcjfXGh6lqu5UqpEpNcXVJRSSzqqWe


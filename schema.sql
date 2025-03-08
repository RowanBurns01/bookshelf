--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Book" (
    id text NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    isbn text,
    "coverImage" text,
    description text,
    "pageCount" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "averageRating" double precision,
    "googleBooksId" text,
    "publishDate" timestamp(3) without time zone,
    "reviewCount" integer DEFAULT 0 NOT NULL,
    "trendingScore" double precision DEFAULT 0,
    "viewCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Book" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Follows" (
    "followerId" text NOT NULL,
    "followingId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Follows" OWNER TO postgres;

--
-- Name: List; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."List" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."List" OWNER TO postgres;

--
-- Name: ListBook; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ListBook" (
    "listId" text NOT NULL,
    "bookId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id text NOT NULL,
    "order" integer NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ListBook" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    rating integer NOT NULL,
    content text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "bookId" text NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: TrendingMetrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TrendingMetrics" (
    id text NOT NULL,
    "bookId" text NOT NULL,
    "viewsLast24h" integer DEFAULT 0 NOT NULL,
    "viewsLast7d" integer DEFAULT 0 NOT NULL,
    "reviewsLast7d" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TrendingMetrics" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "hashedPassword" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserBook; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserBook" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "bookId" text NOT NULL,
    status text NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserBook" OWNER TO postgres;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO postgres;

--
-- Name: _BookToCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BookToCategory" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BookToCategory" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Book Book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Follows Follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Follows"
    ADD CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerId", "followingId");


--
-- Name: ListBook ListBook_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ListBook"
    ADD CONSTRAINT "ListBook_pkey" PRIMARY KEY (id);


--
-- Name: List List_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."List"
    ADD CONSTRAINT "List_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: TrendingMetrics TrendingMetrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrendingMetrics"
    ADD CONSTRAINT "TrendingMetrics_pkey" PRIMARY KEY (id);


--
-- Name: UserBook UserBook_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBook"
    ADD CONSTRAINT "UserBook_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _BookToCategory _BookToCategory_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BookToCategory"
    ADD CONSTRAINT "_BookToCategory_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Book_googleBooksId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Book_googleBooksId_key" ON public."Book" USING btree ("googleBooksId");


--
-- Name: Book_isbn_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Book_isbn_key" ON public."Book" USING btree (isbn);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: ListBook_listId_bookId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ListBook_listId_bookId_key" ON public."ListBook" USING btree ("listId", "bookId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: TrendingMetrics_bookId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TrendingMetrics_bookId_key" ON public."TrendingMetrics" USING btree ("bookId");


--
-- Name: UserBook_userId_bookId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserBook_userId_bookId_key" ON public."UserBook" USING btree ("userId", "bookId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: _BookToCategory_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BookToCategory_B_index" ON public."_BookToCategory" USING btree ("B");


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follows Follows_followerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Follows"
    ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Follows Follows_followingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Follows"
    ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ListBook ListBook_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ListBook"
    ADD CONSTRAINT "ListBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."Book"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ListBook ListBook_listId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ListBook"
    ADD CONSTRAINT "ListBook_listId_fkey" FOREIGN KEY ("listId") REFERENCES public."List"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: List List_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."List"
    ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."Book"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TrendingMetrics TrendingMetrics_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrendingMetrics"
    ADD CONSTRAINT "TrendingMetrics_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."Book"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserBook UserBook_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBook"
    ADD CONSTRAINT "UserBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."Book"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserBook UserBook_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBook"
    ADD CONSTRAINT "UserBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BookToCategory _BookToCategory_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BookToCategory"
    ADD CONSTRAINT "_BookToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES public."Book"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BookToCategory _BookToCategory_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BookToCategory"
    ADD CONSTRAINT "_BookToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


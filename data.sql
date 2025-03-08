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

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "emailVerified", image, "createdAt", "hashedPassword", "updatedAt") FROM stdin;
cm7zzvcql0000xt68yowofk3j	Test User	test@example.com	\N	https://api.dicebear.com/7.x/avataaars/svg?seed=test	2025-03-08 09:20:52.029	\N	2025-03-08 09:20:52.029
cm7zzwqqv0000xt4hart37tm4	Rowan Burns	rljb@xtra.co.nz	\N	\N	2025-03-08 09:21:56.84	$2b$10$.be.X8LT05tjMwmPtI2ddevanEyZLvDGYh2oajAgR/CxPYH.9Wthm	2025-03-08 09:21:56.84
\.


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Book" (id, title, author, isbn, "coverImage", description, "pageCount", "createdAt", "updatedAt", "averageRating", "googleBooksId", "publishDate", "reviewCount", "trendingScore", "viewCount") FROM stdin;
cm7zzvcqq0001xt682kqj212q	The Great Gatsby	F. Scott Fitzgerald	9780743273565	https://books.google.com/books/content?id=iXn5U2IzVH0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	A story of decadence and excess.	180	2025-03-08 09:20:52.034	2025-03-08 09:20:52.034	\N	iXn5U2IzVH0C	1925-04-10 00:00:00	0	0	0
cm7zzvcqs0002xt6847p3kiir	1984	George Orwell	9780451524935	https://books.google.com/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	A dystopian social science fiction novel.	328	2025-03-08 09:20:52.036	2025-03-08 09:20:52.036	\N	kotPYEqx7kMC	1949-06-08 00:00:00	0	0	0
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name) FROM stdin;
\.


--
-- Data for Name: Follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Follows" ("followerId", "followingId", "createdAt") FROM stdin;
\.


--
-- Data for Name: List; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."List" (id, name, description, "isPublic", "createdAt", "updatedAt", "userId") FROM stdin;
cm7zzvcqx0008xt680r6l374j	My Favorite Books	A collection of my all-time favorites	t	2025-03-08 09:20:52.042	2025-03-08 09:20:52.042	cm7zzvcql0000xt68yowofk3j
\.


--
-- Data for Name: ListBook; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ListBook" ("listId", "bookId", "createdAt", id, "order", "updatedAt") FROM stdin;
cm7zzvcqx0008xt680r6l374j	cm7zzvcqq0001xt682kqj212q	2025-03-08 09:20:52.042	cm7zzvcqx000axt68w3eo8ia8	1	2025-03-08 09:20:52.042
cm7zzvcqx0008xt680r6l374j	cm7zzvcqs0002xt6847p3kiir	2025-03-08 09:20:52.042	cm7zzvcqx000bxt68e3m4bj1f	2	2025-03-08 09:20:52.042
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, rating, content, "createdAt", "updatedAt", "userId", "bookId") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: TrendingMetrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TrendingMetrics" (id, "bookId", "viewsLast24h", "viewsLast7d", "reviewsLast7d", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserBook; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserBook" (id, "userId", "bookId", status, progress, "startDate", "endDate", "createdAt", "updatedAt") FROM stdin;
cm7zzvcqt0004xt6868s7gnwd	cm7zzvcql0000xt68yowofk3j	cm7zzvcqq0001xt682kqj212q	completed	100	2024-01-01 00:00:00	2024-01-15 00:00:00	2025-03-08 09:20:52.038	2025-03-08 09:20:52.038
cm7zzvcqw0006xt68yd6ugvy3	cm7zzvcql0000xt68yowofk3j	cm7zzvcqs0002xt6847p3kiir	reading	45	2024-02-01 00:00:00	\N	2025-03-08 09:20:52.041	2025-03-08 09:20:52.041
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _BookToCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BookToCategory" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3dbe7dd4-2e83-4883-b411-dae4485f7e1f	970bc0948422ba35fd31a1062c0c17cd1ea9333d1c328a659b72ce74a6e1b6ae	2025-03-08 20:20:51.043776+11	20250308065531_init	\N	\N	2025-03-08 20:20:51.027378+11	1
2314cf8c-cea3-4cfa-9a64-4a0c651d37ea	fa1911326e60774572bf30dfb2a4a98d597e9941439d56bfd1569d8d9df7ec91	2025-03-08 20:20:51.044928+11	20250308070601_add_hashed_password	\N	\N	2025-03-08 20:20:51.044071+11	1
0b145cf1-a528-4acb-bdf9-b54e4a49c715	52e6a3909fa495f6021dd28cca9aa31ee1116508570b2b99868a911453bc2b41	2025-03-08 20:20:51.055514+11	20250308073219_add_book_data	\N	\N	2025-03-08 20:20:51.045241+11	1
2c93b9ad-4a78-49b6-af5d-3687b3201a31	ab80a534dfa4779eeae4ae5aeac192eea19b283671d6083c8f112e3c8a4229df	2025-03-08 20:20:51.056638+11	20250308080127_add_password_field	\N	\N	2025-03-08 20:20:51.055794+11	1
d27f9f93-f530-4f6e-900b-700f2bf4a65c	3b8459320bdbff59cc7de2c76b3f7730cfe678b12f8bcad71bc1ad141a0d6bee	2025-03-08 20:20:51.059353+11	20250308084527_rest	\N	\N	2025-03-08 20:20:51.056918+11	1
\.


--
-- PostgreSQL database dump complete
--


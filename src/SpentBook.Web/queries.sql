use [SpentBook]
/****** Script for SelectTopNRows command from SSMS  ******/
SELECT * FROM [dbo].[AspNetUsers]
SELECT * FROM [dbo].[AspNetUserLogins]
SELECT * FROM [dbo].[AspNetRoles]
SELECT * FROM [dbo].[AspNetUserClaims]
SELECT * FROM [dbo].[AspNetUserRoles]
SELECT * FROM [dbo].[AspNetUserTokens]

INSERT INTO [dbo].[AspNetRoles] (Id, Name) Values ('7498f315-f0a2-4810-ac72-14584e05b446', 'delete2')
INSERT INTO [dbo].[AspNetUserRoles] (RoleId, UserId) Values ('7498f315-f0a2-4810-ac72-14584e05b446', '08279eea-321c-4108-8685-212815fd4560')

DELETE FROM [dbo].[AspNetUsers]
DELETE FROM [dbo].[AspNetRoles] where id = '7498f315-f0a2-4810-ac72-14584e05b446'
-- CreateIndex
CREATE INDEX "Content_title_idx" ON "Content"("title");

-- CreateIndex
CREATE INDEX "Content_description_idx" ON "Content"("description");

-- CreateIndex
CREATE INDEX "Content_id_idx" ON "Content"("id");

-- CreateIndex
CREATE INDEX "Content_type_idx" ON "Content"("type");

-- CreateIndex
CREATE INDEX "Genre_name_idx" ON "Genre"("name");

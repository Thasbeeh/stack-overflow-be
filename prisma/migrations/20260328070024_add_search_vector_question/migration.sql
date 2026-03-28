-- AlterTable
ALTER TABLE "Question"
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(content, '')), 'B')
) STORED;

-- CreateIndex
CREATE INDEX "Question_search_vector_idx" ON "Question" USING GIN ("search_vector");

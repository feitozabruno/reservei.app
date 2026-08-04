// lib/validateWorkingDays.js

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function validateBlock(block) {
  const errors = {};
  if (!block.start) errors.start = "Informe o horário de início.";
  if (!block.end) errors.end = "Informe o horário de término.";
  if (
    block.start &&
    block.end &&
    toMinutes(block.start) >= toMinutes(block.end)
  ) {
    errors.end = "O término deve ser depois do início.";
  }
  return errors;
}

function hasOverlap(blocks) {
  const validBlocks = blocks.filter((b) => b.start && b.end);
  const sorted = [...validBlocks].sort(
    (a, b) => toMinutes(a.start) - toMinutes(b.start),
  );

  for (let i = 0; i < sorted.length - 1; i++) {
    if (toMinutes(sorted[i].end) > toMinutes(sorted[i + 1].start)) return true;
  }
  return false;
}

export function validateWorkingDays(workingDays) {
  const errors = {};

  workingDays.forEach((day, dayIndex) => {
    if (!day.enabled) return;

    if (day.blocks.length === 0) {
      errors[dayIndex] = {
        message: "Adicione ao menos um horário ou desative o dia.",
      };
      return;
    }

    const blockErrors = {};
    day.blocks.forEach((block, blockIndex) => {
      const fieldErrors = validateBlock(block);
      if (Object.keys(fieldErrors).length > 0) {
        blockErrors[blockIndex] = fieldErrors;
      }
    });

    const dayError = {};
    if (Object.keys(blockErrors).length > 0) dayError.blocks = blockErrors;
    if (hasOverlap(day.blocks))
      dayError.message = "Os blocos de horário não podem se sobrepor.";

    if (Object.keys(dayError).length > 0) errors[dayIndex] = dayError;
  });

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}

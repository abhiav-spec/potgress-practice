import {createBudget,getAllBudgets,getBudgetsByUser,deleteBudget} from "../models/budget.model.js";

//create budget
export const createBudget = async (req, res) => {
  try {
    const {
      user_id,
      category_id,
      limit_amount,
      month,
      year
    } = req.body;

    if (
      !user_id ||
      !category_id ||
      !limit_amount ||
      !month ||
      !year
    ) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const budget = await createBudget(
      user_id,
      category_id,
      limit_amount,
      month,
      year
    );

    res.status(201).json(budget);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

//get all bugets
export const getAllBudgets = async (req, res) => {
  try {
    const budgets =
      await getAllBudgets();

    res.json(budgets);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

//get budgets by user

export const getBudgetsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const budgets =
      await getBudgetsByUser(id);

    res.json(budgets);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

//delete budget

export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteBudget(id);

    res.json({
      message: "Budget deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
